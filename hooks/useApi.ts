"use client"

import { useState, useCallback } from "react"

interface ApiHookResult<T, E = any> {
  data: T | null
  loading: boolean
  error: E | null
  execute: (...args: any[]) => Promise<T>
}

/**
 * Hook para realizar peticiones a la API
 * @param apiFunction Función de la API a ejecutar
 * @returns Objeto con datos, estado de carga, error y función para ejecutar la petición
 */
export function useApi<T, E = any>(apiFunction: (...args: any[]) => Promise<T>): ApiHookResult<T, E> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiFunction(...args)
        setData(result)
        return result
      } catch (err) {
        setError(err as E)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFunction],
  )

  return { data, loading, error, execute }
}
