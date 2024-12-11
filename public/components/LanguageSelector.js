import React from 'react'
import { ChakraProvider, Text } from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider, Button
} from '@chakra-ui/react'
import { LanguageList } from './LanguageConstants'

const LanguageSelector = ({ language, onSelect }) => {
  const languages = Object.entries(LanguageList)
  return (
    <ChakraProvider>
      <Menu isLazy>
        <MenuButton as={Button}>
          {language}
        </MenuButton>
        <MenuList>
          {
            languages.map(([language, version]) => (
              <MenuItem key={language} _hover={{bg:"gray.200"}} onClick={() => onSelect(language)}>{language} &nbsp; 
                <Text as="span" color="gray.600" fontSize="small">{version}</Text>
              </MenuItem>
            ))
          }
        </MenuList>
      </Menu>
    </ChakraProvider>
  )
}

export default LanguageSelector