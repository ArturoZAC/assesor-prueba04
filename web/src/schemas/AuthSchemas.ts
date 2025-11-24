import * as Yup from "yup";

export const SchemaLogin = Yup.object().shape({
  email: Yup.string()
    .email("Email invalido")
    .required("Este campo es requerido"),
  password: Yup.string()
    .required("Este campo es requerido")
    .min(8, "No cumple con el mínimo de caracteres"),
});
