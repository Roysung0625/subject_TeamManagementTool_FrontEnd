import { getApiUrl, getAuthHeaders, DEFAULT_REQUEST_OPTIONS, HTTP_STATUS } from '@/config/api'

// APIクライアントクラス
class ApiClient {
  constructor() {
    this.token = null
  }

  // トークン設定
  setToken(token) {
    this.token = token
  }

  // トークン削除
  clearToken() {
    this.token = null
  }

  // 基本リクエストメソッド
  //endpointを送信し、optionは基本設定以外に設定するものがあれば送信する
  async request(endpoint, options = {}, queryParams = {}) {
    const url = getApiUrl(endpoint, queryParams)
    // Header {Authorization: Bearer token} 形式
    const headers = getAuthHeaders(this.token)
    
    // DEFAULT_REQUEST_OPTIONSのすべてのプロパティを列挙し、optionsのすべてのプロパティを列挙する、optionは同じプロパティがあれば上書きする
    const config = {
      ...DEFAULT_REQUEST_OPTIONS,
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    }

    try {
        //configは事前に定義
      const response = await fetch(url, config)
      
      // 204 No Contentは成功だがレスポンス本文がない
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return null
      }
      
      //エラーメッセージ返却時、 
      if (!response.ok) {
        //jsonパースが失敗した場合空オブジェクト返却するように
        const errorData = await response.json().catch(() => ({}))
        //できればエラーメッセージを受け取り、ない場合はエラーコードでError生成
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)
        error.status = response.status
        error.data = errorData
        throw error
      }
      
      //jsonパース、jsオブジェクトに変換
      const data = await response.json()
      return data
    } catch (error) {
      console.error('APIリクエストエラー:', error)
      throw error
    }
  }

  // GETリクエスト
  async get(endpoint, queryParams = {}, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options
    }, queryParams)
  }

  // POSTリクエスト
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options
    })
  }

  // PUTリクエスト
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options
    })
  }

  // DELETEリクエスト
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    })
  }

  // PATCHリクエスト
  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options
    })
  }
}

// シングルトンインスタンス生成
const apiClient = new ApiClient()

export default apiClient 