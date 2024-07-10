import { DocumentContext } from "@/context/documents-context";
import { useContext } from "react";

export function useDocument() {
    return useContext(DocumentContext);
}