// ==========================================================================
// Política de contraseña — MISMA regla que `API_REST/src/common/constants`
// y `API_REST/src/common/utils` (`STRONG_PASSWORD_REGEX` /
// `assertPasswordIsSafe`). El backend es quien de verdad la hace cumplir
// (nunca confíes solo en el cliente) — esto es para dar feedback inmediato
// en el formulario en vez de que el usuario se entere solo después de
// enviar. Si cambias la regla en un lado, cámbiala en el otro.
// ==========================================================================

export const PASSWORD_MIN_LENGTH = 10;

/** minúscula + mayúscula + número + carácter especial, largo mínimo `PASSWORD_MIN_LENGTH`. */
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

export const STRONG_PASSWORD_MESSAGE =
  "Debe tener al menos 10 caracteres, con mayúsculas, minúsculas, números y un carácter especial (ej. !@#$%&*)";

// Mismo criterio que `WEAK_PASSWORDS` en el backend (lista no exhaustiva,
// case-insensitive) — ver ahí el porqué de cada bloque.
const WEAK_PASSWORDS = new Set(
  [
    "12345678", "123456789", "1234567890", "87654321", "11111111", "00000000",
    "22222222", "123123123", "12341234", "654321", "111222333", "01234567",
    "password", "password1", "password123", "passw0rd", "p@ssword", "p@ssw0rd",
    "letmein", "letmein123", "welcome", "welcome1", "welcome123", "admin123",
    "iloveyou", "iloveyou1", "princess", "football", "baseball", "basketball",
    "dragon", "master", "monkey", "monkey123", "sunshine", "shadow", "superman",
    "trustno1", "whatever", "freedom", "ninja", "mustang", "access", "flower",
    "loveme", "harley", "ranger", "buster", "soccer", "hockey", "killer",
    "jordan23", "computer", "batman", "corvette", "jordan", "cheese", "blahblah",
    "starwars", "tinker", "minecraft", "qazwsx", "qwerty", "qwerty123",
    "qwertyuiop", "asdfghjkl", "zxcvbnm", "1q2w3e4r", "abcd1234", "a1b2c3d4",
    "changeme", "changeit", "default", "guest", "test1234", "temp1234",
    "contraseña", "contrasena", "contraseña123", "contrasena123", "micontrasena",
    "cambiar123", "hola1234", "holamundo", "holamundo123", "usuario123",
    "correo123", "milagro", "corazon", "teamo1234", "bendecido", "futbol123",
    "campeon123", "amorcito", "mifamilia", "12345678a", "contraseñasegura",
    "clave1234", "micuenta123", "nuevaclave", "password1234",
    "agrolink", "agrolink123", "agrolink1", "honduras123", "tegucigalpa123",
    "comprador123", "vendedor123", "agricultor123",
    "password1!", "password123!", "p@ssword1", "p@ssw0rd1", "welcome123!",
    "qwerty123!", "abcd1234!", "iloveyou1!",
    "contraseña123!", "contrasena123!", "clave1234!",
    "agrolink123!", "agrolink1!", "honduras123!",
  ].map((p) => p.toLowerCase())
);

function foldText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function hasRepeatedRun(password: string): boolean {
  return /(.)\1{3,}/.test(password);
}

const SEQUENTIAL_PATTERNS = [
  "0123456789",
  "abcdefghijklmnopqrstuvwxyz",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

function hasObviousSequence(password: string): boolean {
  const lower = password.toLowerCase();
  for (const pattern of SEQUENTIAL_PATTERNS) {
    for (let i = 0; i <= pattern.length - 4; i++) {
      const chunk = pattern.slice(i, i + 4);
      if (lower.includes(chunk) || lower.includes([...chunk].reverse().join(""))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Reglas que un simple regex no cubre solo — devuelve un mensaje de error
 * listo para mostrar, o `null` si la contraseña pasa. Se usa tanto desde
 * `.superRefine()` de zod (registro) como desde formularios con estado
 * manual (cambiar/restablecer contraseña).
 */
export function getPasswordContextError(
  password: string,
  contextValues: Array<string | null | undefined>
): string | null {
  if (WEAK_PASSWORDS.has(password.toLowerCase())) {
    return "Esa contraseña es demasiado común. Elige una diferente.";
  }

  const foldedPassword = foldText(password);
  for (const raw of contextValues) {
    if (!raw) continue;
    const pieces = raw.includes("@") ? [raw.split("@")[0]] : raw.split(/\s+/);
    for (const piece of pieces) {
      const folded = foldText(piece);
      if (folded.length < 4) continue;
      if (foldedPassword.includes(folded)) {
        return "La contraseña no debe contener tu nombre ni tu correo electrónico.";
      }
    }
  }

  if (hasRepeatedRun(password)) {
    return "La contraseña no debe repetir el mismo carácter varias veces seguidas.";
  }
  if (hasObviousSequence(password)) {
    return 'La contraseña no debe usar secuencias obvias como "1234" o "abcd".';
  }
  return null;
}

/** Todo en una sola llamada: patrón + longitud + reglas contextuales. `null` = válida. */
export function validatePassword(
  password: string,
  contextValues: Array<string | null | undefined> = []
): string | null {
  if (password.length < PASSWORD_MIN_LENGTH || !STRONG_PASSWORD_REGEX.test(password)) {
    return STRONG_PASSWORD_MESSAGE;
  }
  return getPasswordContextError(password, contextValues);
}
