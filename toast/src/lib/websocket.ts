import WebSocket from "isomorphic-ws";
import ReconnectingWebSocket from "reconnecting-websocket";
import { v4 as generateUuid } from "uuid";


const heartbeatInterval = 8000;
const connectionTimeout = 15000;

export type UUID = string;
export type Ref = UUID;
export type Opcode = string;

export type Logger = (
  direction: "in" | "out",
  opcode: Opcode,
  data?: unknown,
  fetchId?: Ref,
  raw?: string
) => void;

export interface Data {
  data: unknown;
  errors: null | unknown
}

export type ListenerHandler = (
  data: Data,
  ref?: Ref
) => void;

export type Connection = {
  close: () => void;

  addListener: (id: Ref | Opcode, listener: ListenerHandler) => () => void;

  sendCast: (opcode: Opcode, data: unknown, ref?: Ref) => void;
  sendCall: (
    opcode: Opcode,
    data: unknown,
  ) => Promise<unknown>;
};

export const connect = (
  {
    logger = () => {},
    url,
    fetchTimeout,
    waitToReconnect,
  }: {
    logger?: Logger;
    url?: string;
    fetchTimeout?: number;
    waitToReconnect?: boolean;
  }
): Promise<Connection> =>
  new Promise((resolve, reject) => {
    const socket = new ReconnectingWebSocket(url, [], {
      connectionTimeout,
      WebSocket,
    });
    const apiSend = (opcode: Opcode, data: unknown, ref?: Ref) => {
        if (socket.readyState !== socket.OPEN) return;

        const raw = JSON.stringify({
            op: opcode,
            p: data,
            ...({ref} ?? {})
        });

        socket.send(raw);
        logger("out", opcode, data, ref, JSON.parse(raw));
    };

    const listeners = new Map<Ref | Opcode, ListenerHandler[]>();

    const addHandler = (id: Ref | Opcode, listener: ListenerHandler) => {
        if (!listeners.has(id)) listeners.set(id, []);
        listeners.get(id).push(listener);
        return () => removeHandler(id, listener);
    };

    const removeHandler = (id: Ref | Opcode, listener: ListenerHandler) => {
        if (!listeners.has(id)) return;
        listeners.get(id).splice(listeners.get(id).indexOf(listener), 1);
    };

    const executeHandler = (id: Ref | Opcode, data: Data, ref?: Ref) => {
        if (!listeners.has(id)) return;
        for (const handler of listeners.get(id)) {
            handler?.(data, ref);
        }
    };

    socket.addEventListener("close", (error) => {
        console.log(error);
        if (!waitToReconnect) reject(error);
    });

    socket.addEventListener("message", (e) => {
        if (e.data === `"pong"` || e.data === `pong`) {
            logger("in", "pong");
            return;
        }

        const message = JSON.parse(e.data);
        const data = message.d || message.p || message.payload;
        const errors = message.e || message.errors
        const operator = message.op || message.operator;

        logger("in", operator, data, message.ref, message);

        executeHandler(operator, {data, errors}, message.ref);
        if (message.ref) executeHandler(message.ref, {data, errors}, message.ref);
    });

    socket.addEventListener("open", () => {
        const id = setInterval(() => {
            if (socket.readyState === socket.CLOSED) {
            clearInterval(id);
            } else {
            socket.send("ping");
            logger("out", "ping");
            }
        }, heartbeatInterval);

        const connection: Connection = {
            close: () => socket.close(),
            addListener: addHandler,
            sendCast: apiSend,
            sendCall: (
                opcode: Opcode,
                data: unknown
            ) =>
            new Promise((resolveCall, rejectFetch) => {
                if (socket.readyState !== socket.OPEN) {
                    rejectFetch(new Error("websocket not connected"));
                    return;
                }

                const ref: Ref = generateUuid();
                let timeoutId: NodeJS.Timeout | null = null;

                const unsubscribe = connection.addListener(
                    ref,
                    data => {
                        if (timeoutId) clearTimeout(timeoutId);

                        unsubscribe();
                        if (data.errors) return rejectFetch(new Error("Errors: " + JSON.stringify(data.errors)));
                        resolveCall(data.data);
                    }
                );

                if (fetchTimeout) {
                    timeoutId = setTimeout(() => {
                        unsubscribe();
                        rejectFetch(new Error("timed out"));
                    }, fetchTimeout);
                }

                apiSend(opcode, data, ref);
            })
        };

        resolve(connection);
    });
  });