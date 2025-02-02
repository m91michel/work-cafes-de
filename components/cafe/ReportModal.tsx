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
import { useCTranslation } from "@/hooks/use-translations";

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
  const { t } = useCTranslation('cafe');

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const response = await axios.post("/api/reports", {
        ...data,
        cafeSlug,
      });

      if (response.status !== 200) {
        toast({
          title: t('report.toast.error.title'),
          description: t('report.toast.error.description'),
        });
        return;
      }

      toast({
        title: t('report.toast.success.title'),
        description: t('report.toast.success.description'),
      });
      onClose();
      reset();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: t('report.toast.error.title'),
        description: t('report.toast.error.description'),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('report.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("email", { required: true })}
            type="email"
            placeholder={t('report.form.email')}
            className="mb-4"
          />
          <Input
            {...register("name", { required: true })}
            placeholder={t('report.form.name')}
            className="mb-4"
          />
          <Textarea
            {...register("message", { required: true })}
            placeholder={t('report.form.message')}
            className="mb-4"
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('report.buttons.cancel')}
            </Button>
            <Button type="submit">
              {t('report.buttons.send')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
