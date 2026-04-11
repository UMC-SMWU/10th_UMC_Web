import { useState, useEffect } from 'react';

interface UseFormProps<T> {
    initialValues: T;
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues); // 사용자가 입력창에 적은 실제 내용들을 기억
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({}); // 건드린 칸만 에러를 보여주려고

    // 입력값이 변경될 때마다 유효성 검사 실행
    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors);
    }, [values, validate]);

    // 글자가 바뀔 때 검사 실행
    const handleChange = (name: keyof T, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value })); // ...prev: 기존에 써둔 달느 칸 내용은 지우지 말라는 뜻
    };

    // 입력창에서 포커스가 빠져나갈 때 실행
    const handleBlur = (name: keyof T) => {
        setTouched((prev) => ({ ...prev, [name as string]: true }));
    };

    // input 태그에 뿌려줄 프로퍼티들을 반환하는 함수
    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(name, e.target.value);
        const onBlur = () => handleBlur(name);

        return { name, value, onChange, onBlur };
    };

    return { values, errors, touched, getInputProps };
}

export default useForm;