import React, { useEffect, useMemo, useRef, useState } from "react";
import * as raw from "../../lib/websocket";

import { apiBaseUrl } from "../../lib/constants";

interface WebSocketProviderProps {
  shouldConnect: boolean;
}

type V = raw.Connection | null;

export const WebSocketContext = React.createContext<{
  conn: V;
  setConn: (c: V) => void;
}>({
  conn: null,
  setConn: () => {},
});

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  shouldConnect,
  children,
}) => {
  const [conn, setConn] = useState<V>(null);
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!conn && shouldConnect && !isConnecting.current) {
      isConnecting.current = true;
      raw
        .connect({
          logger: console.log,
          waitToReconnect: true,
          url: apiBaseUrl.replace("http", "ws") + "/socket"
        })
        .then(setConn)
        .catch((err) => null)
        .finally(() => {
          isConnecting.current = false;
        });
    }
  }, [conn, shouldConnect]);

  return (
    <WebSocketContext.Provider
      value={useMemo(
        () => ({
          conn,
          setConn
        }),
        [conn]
      )}
    >
      {children}
    </WebSocketContext.Provider>
  );
};