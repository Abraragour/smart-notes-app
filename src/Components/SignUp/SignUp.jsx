import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // لازم تكون كدة
export default function SignUp() {
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

 async function handleSignUp(values) {
    setisLoading(true);
    setapiError(null); 
    const dataWithAge = { ...values, age: Number(values.age) };
    
    axios.post('https://smart-notes-backend-production.up.railway.app/api/register/', dataWithAge)
      .then((res) => {
        if (res?.data?.msg === 'done') {

          toast.success("Account created successfully!"); 
          navigate('/login');
        }
      })
      .catch((err) => {
        const responseData = err?.response?.data;

        if (responseData?.msg === "validation_error" && responseData?.errors) {
            const errorEntries = Object.entries(responseData.errors);
            const [field, msgs] = errorEntries[0]; // هنجيب أول حقل فيه مشكلة
            setapiError(`${field}: ${msgs[0]}`); 
        } 
        else if (responseData?.detail) {
            setapiError(responseData.detail);
        }
        else if (responseData?.msg) {
            setapiError(responseData.msg);
        }
        else {
            setapiError("Something went wrong. Please check your internet or try again.");
        }
      })
      .finally(() => setisLoading(false));
  }

 const validationSchema = yup.object({
  username: yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(25, "Username cannot exceed 25 characters")
    .required("Username is required"),
    
  email: yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
    
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
    
  age: yup.number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be a whole number")
    .min(16, "You must be at least 16 years old"),
    
  phone: yup.string()
    .matches(/^01[0125][0-9]{8}$/, "Must be a valid Egyptian phone number")
    .required("Phone number is required"),
});

  const formik = useFormik({
    initialValues: { username: '', email: '', password: '', age: '', phone: '' },
    onSubmit: handleSignUp,
    validationSchema,
  });

  return (
    <form 
      onSubmit={formik.handleSubmit} 
      className="w-full h-full flex flex-col justify-center items-center px-6 md:px-10 bg-transparent"
    >
      <h2 className="text-2xl font-bold text-[#38b29b] mb-4 text-center">Create Account</h2>
      
      {apiError && <div className="mb-2 text-red-500 text-[10px] text-center">{apiError}</div>}

      <div className="w-full max-w-[320px] space-y-2">
        {['username', 'email', 'password', 'age', 'phone'].map((field) => (
          <div key={field} className="w-full">
            <input
              id={field}
              name={field}
              type={field === 'password' ? 'password' : field === 'age' ? 'number' : 'text'}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={field.toUpperCase()}
              className="w-full px-4 py-2 bg-[#f3f7f6] border-none rounded-lg focus:ring-2 focus:ring-[#38b29b] outline-none text-xs transition-all"
            />
            {formik.errors[field] && formik.touched[field] && (
              <p className="text-[9px] text-red-500 mt-0.5 ml-1">* {formik.errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-2.5 rounded-full bg-[#38b29b] text-white font-bold shadow-md hover:bg-[#2f9683] hover:scale-105 transition-all text-sm uppercase tracking-wider"
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'SIGN UP'}
        </button>
      </div>
    </form>
  );
}