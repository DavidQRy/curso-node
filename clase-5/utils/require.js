// Como leer un json en ESModules recomendado por ahora o en su momento
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export const readJSON = (patch) => require(patch)
