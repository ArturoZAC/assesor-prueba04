"use client";
import { Errors } from "@/components/Errors";
import { CheckInput } from "@/components/form/CheckInput";
import { InputForm } from "@/components/form/InputForm";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonSubmit } from "./ButtonSubmit";
import { LoginInterface } from "@/interfaces/AuthInterface";
import { config } from "@/config/config";
import { SchemaLogin } from "@/schemas/AuthSchemas";
import { useAuth } from "@/context/useAuthContext";
import { useRouter } from "next/navigation";

export const FormLogin = () => {
  const { setIsAuthenticated, setUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [mantenerConexion, setMantenerConexion] = useState<boolean>(false);

  const router = useRouter();

  const login = async (values: LoginInterface): Promise<void> => {
    setLoading(true);

    const data = {
      email: values.email,
      password: values.password,
      mantenerConexion: mantenerConexion,
    };

    try {
      const response = await axios.post(`${config.apiUrl}/login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        console.log(response.data.usuario);
        setUser(response.data.usuario);
        router.push("/sistema?option=operaciones");

        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      console.log(error.message);

      toast.error(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  const { handleSubmit, handleChange, errors, values, touched, handleBlur, isSubmitting } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: SchemaLogin,
      onSubmit: login,
    });

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0];
      if (firstErrorElement) {
        firstErrorElement.focus();
      }
    }
  }, [touched, errors, isSubmitting]);

  return (
    <form className="w-full max-w-xl p-3 sm:p-5" onSubmit={handleSubmit}>
      <div className="w-full space-y-6">
        <div className="flex flex-col w-full gap-1">
          <InputForm
            label="Correo electrónico"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Escribe tu correo electrónico"
            type="email"
            value={values.email}
            className={`${
              errors.email && touched.email
                ? "border-red-500 focus:border-red-500"
                : "border-secondary-main focus:border-secondary-main"
            }`}
          />
          {errors.email && <Errors errors={errors.email} touched={touched.email} />}
        </div>
        <div className="flex flex-col w-full gap-1 ">
          <InputForm
            label="Contraseña"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Escribe tu contraseña"
            type="password"
            value={values.password}
            className={`${
              errors.email && touched.email
                ? "border-red-500 focus:border-red-500"
                : " focus:border-secondary-main"
            }`}
          />
          {errors.password && <Errors errors={errors.password} touched={touched.password} />}
        </div>
      </div>
      <div className="flex items-center justify-between w-full mt-3 mb-10">
        <div className="flex items-center gap-2 w-fit">
          <CheckInput
            mantenerConexion={mantenerConexion}
            setMantenerConexion={setMantenerConexion}
          />
          <p className="text-sm text-black-main">Mantenerme conectado</p>
        </div>
      </div>

      <ButtonSubmit loading={loading} text="Ingresar" />
    </form>
  );
};
