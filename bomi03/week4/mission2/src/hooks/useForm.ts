import { useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValue: T; // email, password
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>();
  const [errors, setErrors] = useState<Record<string, string>>();

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text, // email, password
    });
  };
  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true, // email, password
    });
  };
  const getInputProps = (name: keyof T) => {
    const value: T[keyof T] = values[name];

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);
    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  //values가 변경될 때 마다 에러 검증 로직이 실행됨
    useEffect(() => {
        const newErrors = validate(values);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setErrors(newErrors);
    }, [validate, values]);
    return { values, errors, touched, getInputProps };

}

export default useForm;