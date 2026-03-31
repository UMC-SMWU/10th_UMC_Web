// string 타입 예시

// 성공 케이스
const str1: string = "hello world";
console.log(str1);

// 실패 케이스
// const str2: string = 123; // error
// console.log(str2);



// number 타입 예시

// 성공 케이스
const num1: number = 123;
console.log(num1);

// // 실패 케이스
// const num2: number = "123"; // error
// console.log(num2);



// boolean 타입 예시

// 성공 케이스
const bool1: boolean = true;
console.log(bool1);

// // 실패 케이스
// const bool2: boolean = "true"; // error
// console.log(bool2);



// null 타입 예시

// 성공 케이스
const nullValue1: null = null;
console.log(nullValue1);

// // 실패 케이스
// const nullValue2: null = undefined; // error
// console.log(nullValue2);



// undefined 타입 예시

// 성공 케이스
const undefinedValue1: undefined = undefined;
console.log(undefinedValue1);

// // 실패 케이스
// const undefinedValue2: undefined = null; // error
// console.log(undefinedValue2);



// symbol 타입 예시

// 성공 케이스
const symbol1: symbol = Symbol("unique");
console.log(symbol1);

// // 실패 케이스
// const symbol2: symbol = "not a symbol"; // error
// console.log(symbol2);



// bigint 타입 예시

// 성공 케이스
const bigInt1: bigint = 9007199254740991n;
console.log(bigInt1);

// // 실패 케이스
// const bigInt2: bigint = 123; // error
// console.log(bigInt2);



// object 타입 예시

// 성공 케이스
const object1: object = { name: "bomi"};
console.log(object1);

// // 실패 케이스
// const object2: object = "bomi"; // error
// console.log(object2);



// 타입 스크립트에만 존재하는 타입

// any 타입 예시
let value1: any=10;
value1 = "hello";
value1 = true;

// unknown 타입 예시
let value2: unknown = "hello";
// console.log(value2.toUpperCase()); // error

if (typeof value2 === "string") { // 타입 좁히기
  console.log(value2.toUpperCase());
}

// void 타입 예시
function logMessage(): void {
  console.log("hello");
}

// never 타입 예시
function fun1(): never {
    while (true) {} // 무한 루프
}