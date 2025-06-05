import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
export default function Home() {
  return(
    <div className="text-red-300">
      <UserButton></UserButton>
      Hello
      <Button variant="destructive">Hi</Button>
    </div>
  )
}
 