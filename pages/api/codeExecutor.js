import { LanguageList } from '@/public/components/LanguageConstants'
import axios from 'axios'

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

export const executeCode = async (language, sourcecode) => {
    const response = await API.post('/execute', {
        "language": language,
        "version": LanguageList[language],
        "files": [
            {
                "content": sourcecode
            }
        ],
    })
    console.log(response);
    return response.data
}


