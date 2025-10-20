"use client"
 
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect } from "react"
 
export function DatePicker({returnDate}: {returnDate: (date: Date) => void}) {
  const [date, setDate] = React.useState<Date>()
  useEffect(() => {
    if (!date) return;
    returnDate(date);
  }, [date]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal bg-stone-50"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar className="font-mono" mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}