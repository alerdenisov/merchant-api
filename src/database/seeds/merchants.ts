import { EntityManager, Connection } from 'typeorm';
import { MerchantEntity } from 'entities/merchant.entity';
import { ApiKeyEntity } from 'entities/api_keys.entity';
import * as ethers from 'ethers';

export async function seed(connection: Connection): Promise<void> {
  const merchants = await connection.getRepository<MerchantEntity>(
    MerchantEntity,
  );
  const apiKeys = await connection.getRepository<ApiKeyEntity>(ApiKeyEntity);

  const maincoin = merchants.create();
  maincoin.email = 'admin@maincoin.money';
  maincoin.displayName = 'Maincoin MerchantEntity';

  await merchants.save(maincoin);

  const mainkey = apiKeys.create();
  const wallet = ethers.Wallet.fromMnemonic(
    'timber similar retire income arm kit want jeans illegal casino real update',
  );

  mainkey.private_key = wallet.privateKey.substr(2);
  mainkey.public_key = wallet.address.substr(2);
  mainkey.merchant = await merchants.findOne({
    where: {
      email: 'admin@maincoin.money',
    },
  });

  await apiKeys.save(mainkey);
}
