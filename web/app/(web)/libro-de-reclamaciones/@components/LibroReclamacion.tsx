/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

// Definir el esquema de validación con Yup
const validationSchema = Yup.object({
  apellidoPaterno: Yup.string().required("Apellido Paterno es obligatorio"),
  apellidoMaterno: Yup.string().required("Apellido Materno es obligatorio"),
  nombre: Yup.string().required("Nombre es obligatorio"),
  departamento: Yup.string().required("Departamento es obligatorio"),
  provincia: Yup.string().required("Provincia es obligatoria"),
  distrito: Yup.string().required("Distrito es obligatorio"),
  direccion: Yup.string().required("Dirección es obligatoria"),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico es obligatorio"),
  telefono: Yup.string().required("Teléfono o celular es obligatorio"),
  monto: Yup.number()
    .required("Monto es obligatorio")
    .positive("Monto debe ser un número positivo"),
  descripcion: Yup.string(),
  detalleReclamo: Yup.string().required("Detalle del reclamo es obligatorio"),
});

export const LibroReclamacion = () => {
  const enviarLibroReclamacion = async (values: any, resetForm: any) => {
    try {
      const data = {
        ...values,
        monto: parseFloat(values.monto),
      };

      console.log(data);
      const response = await axios.post(
        `https://apiaseso.logosperu.com.pe/api/libro-reclamaciones`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        resetForm();
      }
      console.log("Reclamo enviado con éxito:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error al enviar el reclamo:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
  const formik = useFormik({
    initialValues: {
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombre: "",
      departamento: "",
      provincia: "",
      distrito: "",
      direccion: "",
      correo: "",
      telefono: "",
      monto: "",
      descripcion: "",
      detalleReclamo: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) =>
      enviarLibroReclamacion(values, resetForm),
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Identificación del consumidor reclamante */}
        <div>
          <label
            htmlFor="apellidoPaterno"
            className="block text-sm font-semibold"
          >
            Apellido Paterno*
          </label>
          <input
            type="text"
            id="apellidoPaterno"
            name="apellidoPaterno"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.apellidoPaterno}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.apellidoPaterno && formik.errors.apellidoPaterno && (
            <div className="text-sm text-red-500">
              {formik.errors.apellidoPaterno}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="apellidoMaterno"
            className="block text-sm font-semibold"
          >
            Apellido Materno*
          </label>
          <input
            type="text"
            id="apellidoMaterno"
            name="apellidoMaterno"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.apellidoMaterno}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.apellidoMaterno && formik.errors.apellidoMaterno && (
            <div className="text-sm text-red-500">
              {formik.errors.apellidoMaterno}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="nombre" className="block text-sm font-semibold">
            Nombre(s)*
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.nombre && formik.errors.nombre && (
            <div className="text-sm text-red-500">{formik.errors.nombre}</div>
          )}
        </div>
        <div>
          <label htmlFor="departamento" className="block text-sm font-semibold">
            Departamento*
          </label>
          <input
            type="text"
            id="departamento"
            name="departamento"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.departamento}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.departamento && formik.errors.departamento && (
            <div className="text-sm text-red-500">
              {formik.errors.departamento}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="provincia" className="block text-sm font-semibold">
            Provincia*
          </label>
          <input
            type="text"
            id="provincia"
            name="provincia"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.provincia}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.provincia && formik.errors.provincia && (
            <div className="text-sm text-red-500">
              {formik.errors.provincia}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="distrito" className="block text-sm font-semibold">
            Distrito*
          </label>
          <input
            type="text"
            id="distrito"
            name="distrito"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.distrito}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.distrito && formik.errors.distrito && (
            <div className="text-sm text-red-500">{formik.errors.distrito}</div>
          )}
        </div>
        <div>
          <label htmlFor="direccion" className="block text-sm font-semibold">
            Dirección*
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.direccion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.direccion && formik.errors.direccion && (
            <div className="text-sm text-red-500">
              {formik.errors.direccion}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="correo" className="block text-sm font-semibold">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.correo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.correo && formik.errors.correo && (
            <div className="text-sm text-red-500">{formik.errors.correo}</div>
          )}
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-semibold">
            Teléfono o Celular*
          </label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={formik.values.telefono}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.telefono && formik.errors.telefono && (
            <div className="text-sm text-red-500">{formik.errors.telefono}</div>
          )}
        </div>
      </div>

      {/* Identificación del servicio contratado */}
      <div className="mt-6">
        <label htmlFor="monto" className="block text-sm font-semibold">
          Monto*
        </label>
        <input
          type="number"
          id="monto"
          name="monto"
          className="w-full p-2 mt-1 border border-gray-300 rounded"
          value={formik.values.monto}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.monto && formik.errors.monto && (
          <div className="text-sm text-red-500">{formik.errors.monto}</div>
        )}
      </div>
      <div className="mt-4">
        <label htmlFor="descripcion" className="block text-sm font-semibold">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          className="w-full p-2 mt-1 border border-gray-300 rounded"
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      {/* Detalle del reclamo */}
      <div className="mt-6">
        <label htmlFor="detalleReclamo" className="block text-sm font-semibold">
          Detalle del Reclamo*
        </label>
        <textarea
          id="detalleReclamo"
          name="detalleReclamo"
          className="w-full p-2 mt-1 border border-gray-300 rounded"
          value={formik.values.detalleReclamo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.detalleReclamo && formik.errors.detalleReclamo && (
          <div className="text-sm text-red-500">
            {formik.errors.detalleReclamo}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full p-3 font-semibold text-white-main bg-secondary-main rounded-main"
        >
          Enviar Reclamación
        </button>
      </div>
    </form>
  );
};
