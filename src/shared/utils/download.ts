export const downloadFile = (blob: Blob, filename = "") => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.pdf`);
    document.body.appendChild(link);
    link.click();
};
