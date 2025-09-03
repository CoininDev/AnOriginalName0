package utils

func Mean(things []float64) float64 {
	if len(things) == 0 {
		return 0
	}

	var sum float64 = 0
	for _, t := range things {
		sum += t
	}

	return sum / float64(len(things))
}