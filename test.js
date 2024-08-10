import {listFiles} from "@huggingface/hub"

const files = await listFiles({
    repo: "openai/clip-vit-large-patch14"
})
for await (const f of files) {
    console.log(f)    
}
