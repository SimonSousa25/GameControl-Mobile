import { useEffect, useState } from "react";
import { Modal, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface AppAlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

interface AlertRequest {
  id: number;
  title: string;
  message?: string;
  buttons: AppAlertButton[];
}

let queue: AlertRequest[] = [];
let nextId = 1;
const listeners = new Set<(queue: AlertRequest[]) => void>();

function emit() {
  listeners.forEach((listener) => listener(queue));
}

export const AppAlert = {
  alert(title: string, message?: string, buttons?: AppAlertButton[]) {
    queue = [
      ...queue,
      {
        id: nextId++,
        title,
        message,
        buttons: buttons?.length ? buttons : [{ text: "OK" }],
      },
    ];
    emit();
  },
};

export function AppAlertHost() {
  const [current, setCurrent] = useState<AlertRequest | undefined>(queue[0]);

  useEffect(() => {
    const listener = (next: AlertRequest[]) => setCurrent(next[0]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const close = (button?: AppAlertButton) => {
    queue = queue.slice(1);
    emit();
    button?.onPress?.();
  };

  if (!current) return null;

  const cancelButton = current.buttons.find((b) => b.style === "cancel");
  const stacked = current.buttons.length > 2;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={() => close(cancelButton)}
    >
      <View
        style={styles.overlay}
        lightColor="rgba(3, 7, 13, 0.85)"
        darkColor="rgba(3, 7, 13, 0.85)"
      >
        <View style={styles.card}>
          <View
            style={styles.titleRow}
            lightColor="transparent"
            darkColor="transparent"
          >
            <View style={styles.titleBar} />
            <Text style={styles.title}>{current.title}</Text>
          </View>

          {current.message ? (
            <Text style={styles.message}>{current.message}</Text>
          ) : null}

          <View
            style={[styles.footerRow, stacked && styles.footerStacked]}
            lightColor="transparent"
            darkColor="transparent"
          >
            {current.buttons.map((button, index) => {
              const isCancel = button.style === "cancel";
              const isDanger = button.style === "destructive";

              return (
                <TouchableOpacity
                  key={`${current.id}-${index}`}
                  accessibilityRole="button"
                  activeOpacity={0.8}
                  onPress={() => close(button)}
                  style={[
                    isCancel ? styles.cancelButton : styles.confirmButton,
                    isDanger && styles.confirmButtonDanger,
                    stacked && styles.buttonStacked,
                  ]}
                >
                  <Text
                    style={
                      isCancel ? styles.cancelButtonText : styles.confirmButtonText
                    }
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AppAlert;
