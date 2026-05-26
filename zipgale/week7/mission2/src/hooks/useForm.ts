import { useState, type ChangeEvent, useEffect } from "react";

interface useFormProps<T> {
  initialValue: T; // {email: '', password: ''}
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>; // T에 대한 key값, value는 string
}

function useForm<T>({initialValue, validate}: useFormProps<T>){
  const [values, setValues] = useState(initialValue);

  // 처음 touch된 상태인지 아닌지
  const [touched, setTouched] = useState<Record<string,boolean>>();

  // 어떤 에러인지
  const [errors, setErrors] = useState<Record<string,string>>();

  //t 사용자가 입력값 바꿀 때 실행되는 함수
  const handleChange = (name: keyof T, text: string) => {
    setValues(
      {
        ...values, // 기존 값 유지 - 불변성 유지
        [name]: text
      }
    );
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true
    });
  }

  // 이메일 인풋, 패스워드 인풋, 속성들을 가져온는 것
  const getInputProps = (name: keyof T) => {
    const value = values[name];

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);
    return {value, onChange, onBlur}
  };

  //value가 변경될 때 마다 에러 검증 로직이 실행됨
  
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); // 오류 메시지 업데이트
  }, [validate, values]);

  return {values, errors, touched, getInputProps};
};

export default useForm;