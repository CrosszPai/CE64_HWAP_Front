import { customRandom, random, urlAlphabet } from "nanoid";

const AppNanoid = customRandom(urlAlphabet, 10, random)

export default AppNanoid