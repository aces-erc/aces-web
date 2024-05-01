import { toast } from "sonner";

const copyToClipboard = async (text: string, msg?: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(msg ?? "Copied to clipboard");
  } catch (err) {
    toast.error("Failed to copy to clipboard");
  }
};

export default copyToClipboard;
