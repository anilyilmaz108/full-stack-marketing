import { FormGroup } from '@angular/forms';

// Ascci to Word (Ör; Tokendaki Rol)
export function asciiToWord(code: any) {
  let word: any = [];
  let codes = code.match(/.{3}/g);
  codes.forEach((code: any) => {
    word.push(String.fromCharCode(code));
  });
  return word.join('');
}

// Ascci to Word (Ör; Tokendaki Rol)
export function wordToAscii(word: string) {
  let asciiCode = [];
  for (let index = 0; index < word.length; index++) {
    const code = word.charCodeAt(index);
    asciiCode.push(code.toString().padStart(3, '0'));
  }
  return asciiCode.join('');
}

