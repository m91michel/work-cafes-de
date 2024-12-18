import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeSlug?: string | null;
}

interface FormInputs {
  email: string;
  name: string;
  message: string;
}

export function ReportModal({ isOpen, onClose, cafeSlug }: ReportModalProps) {
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const response = await axios.post("/api/reports", {
        ...data,
        cafeSlug,
      });

      if (response.status !== 200) {
        toast({
          title: "Es ist ein Fehler aufgetreten",
          description: "Bitte versuche es erneut.",
        });
        return;
      }

      toast({
        title: "Erfolgreich gesendet",
        description:
          "Vielen Dank fürs Melden! Wir werden uns umgehend um dein Anliegen kümmern.",
      });
      onClose();
      reset();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Es ist ein Fehler aufgetreten",
        description: "Bitte versuche es erneut.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cafe melden</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("email", { required: true })}
            type="email"
            placeholder="Deine E-Mail"
            className="mb-4"
          />
          <Input
            {...register("name", { required: true })}
            placeholder="Dein Name"
            className="mb-4"
          />
          <Textarea
            {...register("message", { required: true })}
            placeholder="Beschreibe kurz was genau das Problem ist..."
            className="mb-4"
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit">Senden</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
