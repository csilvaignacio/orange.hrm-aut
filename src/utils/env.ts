export function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Falta la variable de entorno "${name}".
            Defínela en tu .env (ver .env.example) o en las variables del pipeline.`);
    }
    return value;
}
