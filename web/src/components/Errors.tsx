'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Errores {
    errors?: any;
    touched?: any;
  }
  
  function isTouched(touched: any): boolean {
    if (typeof touched === 'boolean') return touched;
    if (typeof touched === 'object' && touched !== null) {
      return Object.values(touched).some(isTouched); // busca un true en profundidad
    }
    return false;
  }
  
  export const Errors = ({ errors, touched }: Errores) => {
    const show = isTouched(touched) && !!errors;
  
    return (
      <p className="p-0 pl-2 m-0 mt-0 text-sm text-red-500">
        {show && <span className="text-main">{errors}</span>}
      </p>
    );
  };