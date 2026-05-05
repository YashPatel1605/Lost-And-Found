import { useState } from 'react'
import LostFoundList from '../BrowserAllItem/BrowserAllItem'
import BrowserLostFound from '../BrowserLostFound/BrowserLostFound'
import Footer from '../Footer/Footer'

export default function Browse() {
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<>
			<BrowserLostFound onSearch={setSearchQuery} />
			<LostFoundList searchQuery={searchQuery} />
		</>
	)
}
