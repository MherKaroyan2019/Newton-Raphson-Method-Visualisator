function validateFunction(inputString) {
	try {
		const node = math.parse(inputString)

		const filtered = node.filter(n => n.isSymbolNode)
		const variables = [...new Set(filtered.map(n => n.name))]

		const hasInvalidVariables = variables.filter(name => {
			if (name == 'x'){ 
				return false
			}
			if (name in math){
				return false
			}
			return true
        })
		if (hasInvalidVariables.length != 0) {
			return { isValid: false, reason: `Function contains additional variables: ${variables.filter(v => v !== 'x').join(', ')}` }
		}

		const code = node.compile()
		const testResult = code.evaluate({ x: 1 })

		if (typeof testResult !== 'number' && !math.isBigNumber(testResult) && !math.isFraction(testResult) && !math.isComplex(testResult)) {
			return { isValid: false, reason: "Make sure your equation is valid and produces real numerical values" }
		}

		return { isValid: true, reason: ""}
	} catch (error) {
		return { isValid: false, reason: `Invalid Function` }
	}
}

function validateInput(func, start, end, stepA, stepB, step){
    let validFunction = validateFunction(func)
    let isValid = false
    let reason = ""

    if(!validFunction.isValid){
		reason = validFunction.reason
	}else if(start < -1000 || start > 1000 || end < -1000 || end > 1000){
		reason = "Starting and Ending initial guesses must be in interval from -1000 to 1000"
	}else if(start > end){
		reason = "Starting initial guess must be lower or equal to the Ending initial guess"
	}else if(!Number.isInteger(stepA) || !Number.isInteger(stepB) || stepA < -5 || stepA > 5 || stepB < -5 || stepB > 5){
		reason = "a and b must be integers in the range from -5 to 5"
	}else if((end - start) / step > 1000){
		reason = "The number of initial guesses must not be more than 1000"
	}else{
        isValid = true
    }

    return {isValid: isValid, reason: reason}
}

function validateSession(keys){
    let isValid = true
    let reason = ""
    for(let key of keys){
        if(sessionStorage[key] === null){
            isValid = false
            reason = `${key} is missing`
            break
        }
    }

    return {isValid: isValid, reason: reason}
}