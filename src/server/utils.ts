import service from "./index";

export const getAiService = (str: string) => {
  return service.post('/ai/imageParse', {
    image: str
  })
}