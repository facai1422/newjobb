// 调试抽奖页面加载问题
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yobpdwtturkwqrisirdi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3FyaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugTables() {
  console.log('检查数据库表...')
  
  // 检查 user_balances 表
  try {
    const { data, error } = await supabase
      .from('user_balances')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('user_balances 表错误:', error)
    } else {
      console.log('user_balances 表存在:', data)
    }
  } catch (err) {
    console.error('user_balances 查询失败:', err)
  }
  
  // 检查 user_lottery_chances 表
  try {
    const { data, error } = await supabase
      .from('user_lottery_chances')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('user_lottery_chances 表错误:', error)
    } else {
      console.log('user_lottery_chances 表存在:', data)
    }
  } catch (err) {
    console.error('user_lottery_chances 查询失败:', err)
  }
  
  // 检查 lottery_prizes 表
  try {
    const { data, error } = await supabase
      .from('lottery_prizes')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('lottery_prizes 表错误:', error)
    } else {
      console.log('lottery_prizes 表存在:', data)
    }
  } catch (err) {
    console.error('lottery_prizes 查询失败:', err)
  }
}

debugTables()

