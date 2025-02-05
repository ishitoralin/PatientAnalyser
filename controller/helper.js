import { exec, execSync, execFileSync } from "child_process"

export const handleThrowError = (code, msg) => {
    const error = new Error(msg)
    error.status = code
    return error
}

export const handleResult = (res, data, code) => {
    res.status(code).json({ status: code, result: data, reason: "ok" })
}

export const handleError = (res, error, errCode) => {
    if (errCode === 500 && !error) {
        error = "500 - Server Error"
    }

    if (errCode === 404 && !error) {
        error = "404 - Page not found"
    }

    console.log(error)
    res.status(errCode).json({ status: errCode, error: error })
}

export const handleExec = (cmd) => {
    return new Promise((resolve, reject) => {
        if (cmd) {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }

                if (stderr) {
                    return reject(stderr);
                }

                resolve(stdout);
            });
        } else {
            reject('command is required');
        }
    });
};

export const handleExecSync = (cmd) => {
    if (cmd) {
        try {
            const stdout = execSync(cmd).toString()
            return stdout
        } catch (err) {
            return err
        }
    } else {
        throw new Error('command is required')
    }
};

export const handleExecFileSync = (cmd, arg = []) => {
    try {
        const stdout = execFileSync(cmd, arg, {
            stdio: 'pipe',
            encoding: 'utf8',
        });
        return stdout
    } catch (err) {
        if (err.code) {
            return err.code;
        } else {
            const { stdout, stderr } = err;
            return { stdout, stderr };
        }
    }
}
