import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const login_store = defineStore('login', 
  {
    state:()=>({
      login_status:false,
    })
  }
)

export const user_store = defineStore(
  'user_message',
  {
    state:()=>({
      user_name:void(0),
      password:void(0),
      user_id:void(0),
    })
  }
)