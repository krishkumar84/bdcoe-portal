"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Minus, Plus } from "lucide-react"
import axios from "axios"
import { showFlaggedUserDetail } from "@/lib/action"

interface Props {
  allUser: { _id: string };
}

interface userFlagCount {
    flagCount : number | null
}

export default function FlagUser({allUser} : Props) {
  const [flagCount, setFlagCount] = useState(0)
  const [userFlagCount, setuserFlagCount] = useState<number | null>(0)
  const [fetchExistingFlag, setfetchExistingFlag] = useState<number | null>(0)

  const increaseFlagCount = () => {
    if(flagCount < 3){
      setFlagCount((prevCount) => prevCount + 1)
    }
  }

  const decreaseFlagCount = () => {
    setFlagCount((prevCount) => Math.max(0, prevCount - 1))
  }

  

  useEffect(() => {
    const flagUser = async () => {
      try {
        const res = await axios.post("/api/flag-user", { userId: allUser._id });
        // console.log(res.data);
        setuserFlagCount(res.data.flagCount)
      } catch (err) {
        console.log(err);
      }
    };

    if (flagCount > 0) {
      flagUser();
    }
  }, [flagCount]);

  useEffect(() => {
    const showFlaguser = async () => {
      const user = await showFlaggedUserDetail(allUser._id) as userFlagCount | null;
          // console.log(user[0].flagCount);
          setfetchExistingFlag(user?.flagCount ?? 0)
    }
    showFlaguser();
  },[flagCount])

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Flag</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Flag className="w-6 h-6 text-yellow-500" />
            {
              userFlagCount ? <span className="text-3xl font-bold">{userFlagCount}</span> : <span className="text-3xl font-bold">{fetchExistingFlag}</span>
            }
            
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseFlagCount}
              disabled={flagCount === 0}
              aria-label="Decrease flag count"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={increaseFlagCount}
              aria-label="Increase flag count"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}