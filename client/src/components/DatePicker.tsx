import { useState, ComponentProps, useEffect } from 'react'
import { Box, Grid, GridItem, Button, Text, Center, Select, IconButton,
  HStack, InputGroup, Input, InputLeftElement, useDisclosure,
  Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react'
import { eachDayOfInterval, endOfMonth, isSunday } from 'date-fns'
import { parseISO, formatISOWithOptions } from 'date-fns/fp'
// import { parseDateId, fmtDateId } from './datelib'

import { PrevIcon, NextIcon, CalendarIcon } from './Icons'


export const parseDate = parseISO
export const formatDate = formatISOWithOptions({ representation: 'date' })


export interface DateInputProps extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value: string,
  onChange: (value: string) => void | Promise<void>,
}

// type DateInputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> | CalendarProps
// type DateInputProps = ComponentProps<typeof Input>

export function DateInput({ value, onChange, ...rest }: DateInputProps) {
// export function DateInput(props: DateInputProps) {
  const { onOpen, onClose, isOpen } = useDisclosure()

  let dateValue: Date
  if (!!value) {
    dateValue = parseDate(value)
    if (isNaN(dateValue.valueOf())) {
      dateValue = new Date()
    }
  } else {
    dateValue = new Date()
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <InputGroup>
        <InputLeftElement>
          <PopoverTrigger>
            <CalendarIcon color="gray.300"/>
          </PopoverTrigger>
        </InputLeftElement>
        <Input value={value} onChange={ev => onChange(ev.target.value)} {...rest}/>
        {/* <InputRightAddon>
          <CalendarIcon/>
        </InputRightAddon> */}
      </InputGroup>
      <PopoverContent>
        <PopoverArrow/>
        <PopoverCloseButton/>
        <PopoverHeader>Select Date</PopoverHeader>
        <PopoverBody>
          <Calendar value={dateValue} onChange={value => onChange(formatDate(value))} onClickDate={onClose}/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

function Calendar({ value, onChange, onClickDate }: {
  value: Date,
  onChange: (value: Date) => void | Promise<void>,
  onClickDate: () => void,
}) {
  const [year, setYear] = useState<number>(() => value.getFullYear())
  const [month, setMonth] = useState<number>(() => value.getMonth())

  useEffect(() => {
    setYear(value.getFullYear())
    setMonth(value.getMonth())
  }, [value])

  const firstDayOfMonth = new Date(year, month, 1)
  // console.log(firstDayOfMonth, year, month)
  const paddingDay = firstDayOfMonth.getDay()
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: endOfMonth(firstDayOfMonth)
  })
  // console.log(getDaysInMonth(firstDayOfMonth))
  // const daysInMonth = range(1, getDaysInMonth(firstDayOfMonth) + 1)

  const handlePrevClick = () => {
    if (month === 0) {
      setMonth(11)
      setYear(old => old - 1)
    } else {
      setMonth(old => old - 1)
    }
  }

  const handleNextClick = () => {
    if (month === 11) {
      setMonth(1)
      setYear(old => old + 1)
    } else {
      setMonth(old => old + 1)
    }
  }

  const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const DAY_OF_WEEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  return (
    <Box
      // boxShadow="md"
      // borderRadius="5px" borderWidth="1px" borderColor="gray.200"
      // p="1rem"
      w="300px"
    >
      <Grid
        width="100%"
        templateRows="repeat(7, 1fr)"
        templateColumns="repeat(7, 1fr)"
        gap={1}
      >
        <GridItem colSpan={7}>
          <HStack>
            <IconButton
              aria-label="previous month"
              size="xs"
              variant="ghost"
              icon={<PrevIcon/>}
              onClick={handlePrevClick}
            />

            <Select
              value={month}
              onChange={(ev) => setMonth(parseInt(ev.target.value))}
              size="xs"
              textAlign="center"
            >
              {MONTH_NAMES.map((monthName, index) => (
                <option key={index} value={index}>
                  {monthName}
                </option>
              ))}
            </Select>

            {/* <Editable
              defaultValue={toString(year)}
              value={toString(year)}
              onChange={(value) => setYear(parseInt(value))}
              fontSize="xs"
              minW="70px"
              textAlign="center"
            >
              <EditableInput/>
              <EditablePreview/>
            </Editable> */}

            <NumberInput
              defaultValue={year}
              value={year}
              onChange={(_, valueAsNumber) => setYear(valueAsNumber)}
              // fontSize="xs"
              minW="70px"
              textAlign="center"
              size="xs"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <IconButton
              aria-label="next month"
              size="xs"
              variant="ghost"
              icon={<NextIcon/>}
              onClick={handleNextClick}
            />
          </HStack>
        </GridItem>
        {DAY_OF_WEEK.map((dow, index) => (
          <GridItem key={index}>
            <Center>
              <Text fontSize="xs" color={index === 0 ? "red.500" : "gray.500"}>{dow}</Text>
            </Center>
          </GridItem>
        ))}
        {paddingDay > 0 && (
          <GridItem colSpan={paddingDay}></GridItem>
        )}
        {daysInMonth.map((day, index) => (
          <GridItem key={index}>
            <Button
              w="100%"
              variant="ghost"
              size="xs"
              color={isSunday(day) ? "red.500" : undefined}
              onClick={() => {
                if (!!onChange) {
                  onChange(day)
                }
                onClickDate()
              }}
            >
              {day.getDate()}
            </Button>
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
}
