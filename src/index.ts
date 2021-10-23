import {
  Command,
  flags,
} from '@oclif/command'
import {scrap} from './scrap'
import {sendTelegramMessage} from './sendTelegramMessage'

class ShinhanLimitScrap extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: 'name to print',
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
    id: flags.string({
      char: 'i',
      description: '신한카드 계정 아이디',
      required: true,
    }),
    password: flags.string({
      char: 'p',
      description: '신한카드 계정 비밀번호',
      required: true,
    }),
    chatId: flags.string({
      char: 'c',
      description: '텔레그램 채팅 아이디',
      required: false,
    }),
  }

  static args = [{name: 'file'}]

  async run() {
    const {
      args,
      flags,
    } = this.parse(ShinhanLimitScrap)
    const result = await scrap({
      id: flags.id,
      password: flags.password,
    })

    if (flags.chatId !== undefined) {

      await sendTelegramMessage({
        chatId: flags.chatId,
        message: `기간: ${result?.period}\n이용: ${result?.amount}\n잔여: ${result?.remains}`,
      })
    }

  }
}

export = ShinhanLimitScrap
