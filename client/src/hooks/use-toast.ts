import { toast as sonnerToast } from "sonner";
import { ToastAction } from "@/components/ui/toast"; // Keep this for potential future use with radix toasts

export function useToast() {
  const toast = (props: {
    title: string;
    description?: React.ReactNode;
    action?: React.ReactElement<typeof ToastAction>;
    variant?: "default" | "destructive" | null | undefined; // For compatibility, though sonner uses its own styles
    duration?: number;
  }) => {
    // Map Radix UI toast props to Sonner props
    sonnerToast[props.variant === "destructive" ? "error" : "info"](props.title, {
      description: props.description,
      duration: props.duration,
      // Sonner does not have a direct 'action' component like Radix.
      // For more complex actions, one might need to customize sonner further or use Radix toasts.
      // For simplicity, we'll omit complex actions or just display them as text if possible.
      // If props.action is passed, it will be ignored for now.
    });
  };

  return { toast };
}