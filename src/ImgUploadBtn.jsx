import { useRef } from "react";

export function ImgUploadBtn({ img, onUpload, size = 64, dark }) {
    const ref = useRef();
    const onChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => onUpload(ev.target.result);
        reader.readAsDataURL(file);
        e.target.value = "";
    };
    return (
        <>
            <input type="file" accept="image/*" ref={ref} onChange={onChange} style={{ display: "none" }} />
            <div
                onClick={() => ref.current?.click()}
                title="Tap to upload photo"
                style={{ width: size, height: size, borderRadius: "50%", cursor: "pointer", flexShrink: 0, border: `2px dashed ${img ? "transparent" : dark ? "#555" : "#ccc"}`, background: img ? "transparent" : dark ? "#2a2a3e" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", transition: "opacity 0.2s" }}
                onMouseEnter={e => { if (img) e.currentTarget.querySelector(".ov").style.opacity = "1"; }}
                onMouseLeave={e => { if (img) e.currentTarget.querySelector(".ov").style.opacity = "0"; }}
            >
                {img
                    ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: size * 0.36, opacity: 0.35 }}>📷</span>
                }
                {img && (
                    <div className="ov" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}>
                        <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>Change</span>
                    </div>
                )}
            </div>
        </>
    );
}
