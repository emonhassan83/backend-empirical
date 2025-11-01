import { Types } from 'mongoose';
import { deleteManyFromS3 } from '../../utils/s3';
import Product from './product.models';

export const DeleteProductImages = async (id: string, keys: string[]) => {
  await Promise.all(
    keys.map(async key => {
      await Product.findByIdAndUpdate(id, {
        $pull: { images: { key } },
      });
    }),
  );

  const newKeys: string[] = [];
  keys.forEach(key => {
    newKeys.push(`images/product/${key}`);
  });

  if (newKeys.length) {
    deleteManyFromS3(newKeys);
  }
};
