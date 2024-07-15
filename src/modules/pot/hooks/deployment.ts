import { useForm } from "react-hook-form";

export const usePotDeploymentForm = () => {
  const form = useForm();

  return { form };
};
