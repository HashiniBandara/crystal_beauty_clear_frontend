import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function mediaUpload(file) {

    const promise = new Promise(
        (resolve,reject)=>{
            if(file==null){
                reject("No file selected");
            }

            const timeStamp = new Date().getTime();
            const newFileName = timeStamp+file.name;

            supabase.storage.from("images").upload(newFileName,file,{
                cacheControl: '3600',
                upsert: false,
            }).then(
                ()=>{
                    const url=supabase.storage.from("images").getPublicUrl(newFileName).data.publicUrl;
                    resolve(url);
                }
            ).catch(
                (error)=>{
                    console.log(error);
                    reject("File upload failed");
                }
            )
        }
    )
    return promise
}

