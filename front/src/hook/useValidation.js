import React, { useState } from "react";

// 공백 검사
const isEmpty = (value) => value.trim() === "";

// 이메일 유효성 검사
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 태그 아이디 유효성 검사 (대소문자 및 허용된 특수 문자)
const isValidTagId = (tag_id) => /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z0-9!@#^]{1,20}$/.test(tag_id);

// 전화번호 유효성 검사 (형식: 000-0000-0000 또는 000-000-0000 등)
const isValidPhone = (phone) => /^\d{3}-\d{3,4}-\d{4}$/.test(phone);

export default function useValidation() {
  const [errors, setErrors] = useState({});

  const validate = (fields) => {
    const newErrors = {};

    if (isEmpty(fields.username)) newErrors.username = "이름을 입력하세요.";
    if (isEmpty(fields.email)) newErrors.email = "이메일을 입력해주세요";
    else if (!isValidEmail(fields.email))
      newErrors.email = "올바른 이메일이 아닙니다.";

    if (isEmpty(fields.tag_id))
      newErrors.tag_id = "태그 아이디를 입력해 주세요.";
    else if (!isValidTagId(fields.tag_id)) {
      newErrors.tag_id =
        "태그 아이디는 최대 20자 이며, !, @, #, ^만 허용됩니다.";
    }

    if (isEmpty(fields.pwd)) newErrors.pwd = "비밀번호를 입력해 주세요.";
    if (fields.pwd !== fields.rpwd)
      newErrors.rpwd = "비밀번호들이 일치하지 않습니다.";

    if (isEmpty(fields.phone)) newErrors.phone = "전화번호를 입력해 주세요";
    else if (!isValidPhone(fields.phone)) {
      newErrors.phone = "전화버호는 000-0000-0000 형식으로 입력해주세요.";
    }

    if (isEmpty(fields.birthday))
      newErrors.birthday = "생년월일을 입력해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
}
