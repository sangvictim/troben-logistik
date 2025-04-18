import { Label } from '@/components/ui/label';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface SuggestionInterface {
    id: string,
    kecamatan: string,
    kota: string,
    provinsi: string
}

export default function Logistik() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SuggestionInterface[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<SuggestionInterface | null>();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const highlightMatch = (text: string, keyword: string) => {
        const parts = text.split(new RegExp(`(${keyword})`, "gi"));
        return (
            <span>
                {parts.map((part, i) => (
                    <span
                        key={i}
                        className={part.toLowerCase() === keyword.toLowerCase() ? "bg-yellow-200" : ""}
                    >
                        {part}
                    </span>
                ))}
            </span>
        );
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: SuggestionInterface) => {
        setQuery(item.kecamatan);
        setShowSuggestions(false);
        setSelectedLocation(item)
        localStorage.setItem("selectedQuery", JSON.stringify(item));
    };

    useEffect(() => {
        const last: any = localStorage.getItem("selectedQuery");
        setSelectedLocation(JSON.parse(last));
        if (last) setQuery(JSON.parse(last).kecamatan);
    }, []);

    useEffect(() => {
        if (query.trim() === "") {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        const controller = new AbortController();

        const fetchSuggestions = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/locations?search=${encodeURIComponent(query)}`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setSuggestions(data.data);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Failed to fetch suggestions", err.message);
                }
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => {
            clearTimeout(debounce);
            controller.abort();
        };
    }, [query]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center">
                <div className="flex flex-col items-center justify-center h-screen bg-white">
                    <Label className='mb-4 text-5xl'>Search Location</Label>

                    <div className="relative w-full max-w-xl" ref={wrapperRef}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search Google or type a URL"
                        />

                        {showSuggestions && (
                            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-md max-h-60 overflow-y-auto">
                                {loading ? (
                                    <li className="px-4 py-2 text-gray-400 animate-pulse">Loading...</li>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSelect(item)}
                                        >
                                            {highlightMatch(item.kecamatan || '', query)}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-400">No results</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Table>
                            <TableCaption>Location you have choose.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Id</TableHead>
                                    <TableHead>Kecamatan</TableHead>
                                    <TableHead>Kota</TableHead>
                                    <TableHead>Provinsi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">{selectedLocation?.id}</TableCell>
                                    <TableCell>{selectedLocation?.kecamatan}</TableCell>
                                    <TableCell>{selectedLocation?.kota}</TableCell>
                                    <TableCell>{selectedLocation?.provinsi}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}
