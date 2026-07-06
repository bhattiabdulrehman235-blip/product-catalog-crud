const BASE_URL = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = await response.json()
      detail = body.detail || detail
    } catch {
      // response had no JSON body
    }
    throw new Error(detail)
  }

  if (response.status === 204) return null
  return response.json()
}

export function fetchProducts({ skip = 0, limit = 12, search = '', category = '' } = {}) {
  const params = new URLSearchParams({ skip, limit })
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  return request(`/products?${params.toString()}`)
}

export function fetchCategories() {
  return request('/products/categories')
}

export function createProduct(payload) {
  return request('/products', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateProduct(id, payload) {
  return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' })
}
