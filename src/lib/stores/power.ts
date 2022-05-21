import { tweened } from 'svelte/motion'
import { mapRange } from 'fractils'

export const power = tweened(0, { duration: 50 })

export const updatePower = (p: number, floor: number) => {
	const targetPower = mapRange(Math.max(p, floor), floor, 200, 0, 100)
	power.set(targetPower)
}
