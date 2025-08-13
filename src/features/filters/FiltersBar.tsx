import React from 'react'
import { useUI } from '../../state/store'
import { Button, Card, Input } from '../../ui/components'

export function FiltersBar() {
  const { seed, setSeed } = useUI()
  
  return (
    <Card className="mb-6 p-4">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">
            Data Seed:
          </span>
          <Input
            type="number"
            min={1}
            value={seed}
            onChange={(e) => setSeed(Number(e.currentTarget.value))}
            className="w-24 text-sm"
          />
        </div>
        <Button 
          variant="success"
          size="small"
          onClick={() => setSeed(Math.floor(Math.random() * 1000))}
        >
          🎲 Randomize
        </Button>
      </div>
    </Card>
  )
}
