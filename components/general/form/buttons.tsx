import { useCTranslation } from "@/hooks/use-translation";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

type FormSubmitProps = {
  disabled?: boolean;
};
export function FormSubmit({ disabled }: FormSubmitProps) {
  const { t } = useCTranslation("common");
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending || disabled}>
      {t("actions.submit")}
    </Button>
  );
}

type FormResetProps = {
  disabled?: boolean;
};
export function FormReset({ disabled }: FormResetProps) {
  const { t } = useCTranslation("common");
  const { reset } = useForm();
  return (
    <Button type="button" variant="secondary" onClick={() => reset()} disabled={disabled}>
      {t("actions.reset")}
    </Button>
  );
}
