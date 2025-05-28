'use client';

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CdrTable() {
  const [cdrData, setCdrData] = useState<{ headers: string[], data: string[][] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cdrs');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setCdrData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cdrData) return <div>No data available</div>;

  return (
    <div className="h-full overflow-auto w-full max-w-full">
      <div className="min-w-full inline-block align-middle">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {cdrData.headers.map((header, index) => (
                <TableHead key={index} className="whitespace-nowrap">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cdrData.data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="whitespace-nowrap">{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 