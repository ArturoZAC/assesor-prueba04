"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoaderSubmit } from "@/components/form/LoaderSubmit";
import { config } from "@/config/config";
import { useAuth } from "@/context/useAuthContext";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import VerResultados, { Errores } from "../../operaciones/@components/resultados/VerResultados";
import { toast } from "sonner";
import { FaInfo } from "react-icons/fa";
export const UploadData = ({ route }: { route: string | undefined }) => {
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openModal, setModalContent } = useAuth()

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [loading]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;

    window.history.pushState = function (...args) {
      if (loading) {
        const ok = window.confirm(
          "¡Atención! Hay una subida en curso. Si navegas ahora, se cancelará. ¿Seguro que quieres continuar?"
        );
        if (!ok) return;
      }
      return origPush.apply(this, args as any);
    };
    window.history.replaceState = function (...args) {
      if (loading) {
        const ok = window.confirm(
          "¡Atención! Hay una subida en curso. Si navegas ahora, se cancelará. ¿Seguro que quieres continuar?"
        );
        if (!ok) return;
      }
      return origReplace.apply(this, args as any);
    };

    const onPopState = () => {
      if (loading) {
        const ok = window.confirm(
          "¡Atención! Hay una subida en curso. Si navegas ahora, se cancelará. ¿Seguro que quieres continuar?"
        );
        if (!ok) {
          // rehacer el estado actual para anular el pop
          window.history.pushState(null, "", window.location.href);
        }
      }
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener("popstate", onPopState);
    };
  }, [loading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setErrores([]);

      const res = await axios.post(`${config.apiUrl}${route}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("DATA: ", res.data)
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setModalContent(<VerResultados error={error.response?.data.errores as Errores[]} />);
        openModal()
        toast.error("Error subiendo archivo");
        setErrores(error.response?.data.errores)
        console.error("Error subiendo archivo:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <div className="flex w-fit gap-2">
        {
          errores.length > 0 && (
            <button onClick={() => { 
              setModalContent(<VerResultados error={errores} /> )
              openModal()
            }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary-700 active:scale-90 bg-primary-main rounded-main text-white-main">
              <FaInfo />
            </button>
          )
        }
        {!loading ? (
          <label className="flex justify-center min-w-[100px] items-center gap-2 px-4 py-2 transition-all duration-200 bg-green-700 cursor-pointer text-white-main rounded-main active:scale-90 hover:bg-green-800">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              hidden
            />
            <IoCloudUploadSharp size={25} />
          </label>
        ) : (
          <div className="flex min-w-[148px] justify-center items-center gap-2 px-4 opacity-90 py-2 transition-all duration-200 bg-green-700 cursor-pointer text-white-main rounded-main">
            <LoaderSubmit /> Subiendo
          </div>
        )}
      </div>
    </>
  );
};
