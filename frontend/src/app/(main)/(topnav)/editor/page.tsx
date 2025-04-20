"use client"
import { debounce } from "@/lib/util";
import { SyntheticEvent, useCallback, useMemo, useRef, useState } from "react";
import { Prism } from "react-syntax-highlighter";
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeEditor from "@/components/CodeEditor";
import EditorTabBar from "@/components/editor/EditorTabBar";
import { api, useToken } from "@/lib/api/api";
import { Method } from "@srcbox/library";
import FullEditor from "@/components/editor/FullEditor";

const page = () =>
{
    return <FullEditor css="/*CSS*/" js="// JS" html="<!--HTML-->" />
}

export default page;